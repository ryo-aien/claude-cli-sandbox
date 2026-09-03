FROM ubuntu:22.04

# 非対話モードに設定
ENV DEBIAN_FRONTEND=noninteractive

# システムパッケージのインストール
RUN apt-get update && apt-get install -y \
    bash \
    ca-certificates \
    curl \
    git \
    gnupg \
    python3 \
    python3-pip \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Playwright の依存ライブラリのインストール
RUN apt-get update && apt-get install -y \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# GitHub CLI (gh) のインストール
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Node.js 18.x のインストール
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Playwright のインストールとブラウザのダウンロード
RUN npm install -g playwright \
    && playwright install --with-deps chromium

# Python パッケージマネージャー uv のインストール（全ユーザーが使えるよう /usr/local/bin に配置）
RUN curl -LsSf https://astral.sh/uv/install.sh | env UV_INSTALL_DIR=/usr/local/bin sh

# ユーザー設定用の引数
ARG USER_NAME=dev
ARG USER_UID=1000
ARG USER_GID=1000

# グループとユーザーの作成
RUN groupadd --gid ${USER_GID} ${USER_NAME} || true \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m -s /bin/bash ${USER_NAME} \
    && echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# npm グローバルディレクトリの設定
ENV NPM_CONFIG_PREFIX="/home/${USER_NAME}/.npm-global"
ENV PATH="/home/${USER_NAME}/.npm-global/bin:${PATH}"

# ユーザーに切り替え
# USER ${USER_NAME}

# npm グローバルディレクトリの作成
RUN mkdir -p /home/${USER_NAME}/.npm-global

# ワークスペースディレクトリの設定
WORKDIR /workspace

# Claude CLI インストールスクリプトの作成
# USER root
RUN echo '#!/bin/bash\n\
if [ -n "$CLAUDE_INSTALL_CMD" ]; then\n\
    echo "Installing Claude CLI with custom command..."\n\
    eval "$CLAUDE_INSTALL_CMD"\n\
elif [ -f /workspace/bin/claude ]; then\n\
    echo "Installing Claude CLI from local binary..."\n\
    mkdir -p /home/'${USER_NAME}'/.npm-global/bin\n\
    cp /workspace/bin/claude /home/'${USER_NAME}'/.npm-global/bin/claude\n\
    chmod +x /home/'${USER_NAME}'/.npm-global/bin/claude\n\
else\n\
    echo "Installing Claude CLI from npm..."\n\
    npm install -g @anthropic-ai/claude-code\n\
fi\n\
echo "Claude CLI installation completed!"' > /usr/local/bin/install-claude \
    && chmod +x /usr/local/bin/install-claude \
    && chown ${USER_NAME}:${USER_NAME} /usr/local/bin/install-claude

# USER ${USER_NAME}

# Claude CLI のインストール
RUN /usr/local/bin/install-claude

# エントリポイントスクリプトの作成（コンテナ起動時に .env を生成）
# USER root
RUN printf '#!/bin/bash\n# umask 077: 所有者のみ読み書き可能なファイルを生成する\numask 077\ntouch /workspace/.env\nchown root:root /workspace/.env\nchmod 600 /workspace/.env\nexec sudo -u '"${USER_NAME}"' "$@"\n' > /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

# デフォルトコマンド
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
USER ${USER_NAME}
CMD ["/bin/bash"]
